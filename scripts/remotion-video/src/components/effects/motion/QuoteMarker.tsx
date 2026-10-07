/**
 * QuoteMarker — the quote is enlarged into the reading plane (power3.out, scale .83 → 1), light
 * weight and tight tracking, on a flat panel. After a short reading pause the attribution lands
 * and then a highlighter marker grows behind the key phrase. No decorative quote glyph.
 * If images[0] exists it sits beside the quote as a small grayscale photo plate at -3°.
 * data: { "quote": "full quote", "highlight"?: "substring", "highlights"?: ["substring", ...],
 *         "source"?: "Name, role" }
 */
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { clip, ease, look, mix, pace, tween, useMotionConfig } from "./grammar";

const BUILD = 2.4;

export function hasQuoteMarkerData(data: Record<string, unknown>): boolean {
  return !!data && clip(data.quote, 400).length > 0;
}

type Seg = { text: string; mark: number }; // mark = index into highlight list, -1 = none

export const QuoteMarker: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor, images }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useMotionConfig();
  if (!hasQuoteMarkerData(data)) return null;
  const isVertical = height > width;
  const { t } = pace(frame, fps, durationInFrames, BUILD);

  const quote = clip(data.quote, 400);
  const source = clip(data.source, 60);
  const image = images && images[0] ? images[0] : null;

  // collect highlight phrases (single `highlight` and/or `highlights`), find them in the quote
  const wanted: string[] = [];
  if (Array.isArray(data.highlights)) for (const h of data.highlights.slice(0, 3)) wanted.push(String(h ?? "").trim());
  if (typeof data.highlight === "string" && data.highlight.trim()) wanted.unshift(data.highlight.trim());
  const ranges: { s: number; e: number }[] = [];
  for (const h of wanted) {
    if (!h) continue;
    const s = quote.toLowerCase().indexOf(h.toLowerCase());
    if (s >= 0 && !ranges.some((r) => s < r.e && s + h.length > r.s)) ranges.push({ s, e: s + h.length });
  }
  if (!ranges.length) {
    // fallback: last three words
    const m = quote.match(/(\S+\s+){0,2}\S+[^\p{L}\p{N}]*$/u);
    ranges.push({ s: m ? quote.length - m[0].length : 0, e: quote.length });
  }
  const ordered = ranges.slice(0, 3).sort((a, b) => a.s - b.s);
  const segs: Seg[] = [];
  let pos = 0;
  ordered.forEach((r, i) => {
    if (r.s > pos) segs.push({ text: quote.slice(pos, r.s), mark: -1 });
    segs.push({ text: quote.slice(r.s, r.e), mark: i });
    pos = r.e;
  });
  if (pos < quote.length) segs.push({ text: quote.slice(pos), mark: -1 });

  // layout
  const panelW = isVertical ? width - look.safeX * 2 : Math.min(width - look.safeX * 2, image ? 1560 : 1280);
  const plateW = image ? (isVertical ? Math.min(360, width * 0.34) : Math.min(470, panelW * 0.3)) : 0;
  const plateH = Math.round(plateW * 1.36);
  const padX = isVertical ? 44 : 64;
  const padY = isVertical ? 48 : 56;
  const gap = isVertical ? 36 : 56;
  const textW = isVertical ? panelW - padX * 2 : panelW - padX * 2 - (image ? plateW + gap : 0) - 31;
  const availH = isVertical ? height * 0.5 : height * 0.5;
  const fs = Math.max(36, Math.min(72, Math.sqrt((textW * availH) / (quote.length * 0.52 * 1.3))));

  // timeline (absolute seconds)
  const plateP = tween(t, 0.16, 0.4, ease.power2Out);
  const bodyP = tween(t, 0.3, 0.58, ease.power3Out);
  const srcAt = 0.3 + 0.58 + 0.15;
  const srcP = tween(t, srcAt, 0.3, ease.linear);
  const markStart = 0.3 + 0.58 + 0.7 + 0.2; // text landed + reading pause (+ attribution lead)

  const body = (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        borderLeft: `3px solid ${accentColor}`,
        paddingLeft: 28,
        opacity: bodyP,
        transform: `translateY(${mix(bodyP, 30, 0)}px) scale(${mix(bodyP, 0.83, 1)})`,
        transformOrigin: "0% 50%",
      }}
    >
      <div
        style={{
          fontFamily: look.font,
          fontWeight: 500,
          fontSize: fs,
          lineHeight: 1.22,
          letterSpacing: "-0.03em",
          color: look.ink,
        }}
      >
        {segs.map((sg, i) => {
          if (sg.mark < 0) return <React.Fragment key={i}>{sg.text}</React.Fragment>;
          const p = tween(t, markStart + sg.mark * 0.9, 0.6, ease.power2Out);
          return (
            <span
              key={i}
              style={{
                backgroundImage: `linear-gradient(${accentColor}73, ${accentColor}73)`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0 83%",
                backgroundSize: `${p * 100}% 78%`,
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
                padding: "0 0.1em",
                margin: "0 -0.1em",
              }}
            >
              {sg.text}
            </span>
          );
        })}
      </div>
      {source && (
        <div
          style={{
            marginTop: 32,
            textAlign: "right",
            fontFamily: look.font,
            fontWeight: 650 as number,
            fontSize: isVertical ? 28 : 30,
            letterSpacing: "0.04em",
            color: look.muted,
            opacity: srcP,
          }}
        >
          {source}
        </div>
      )}
    </div>
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: panelW,
          boxSizing: "border-box",
          padding: `${padY}px ${padX}px`,
          background: look.surface,
          borderRadius: look.radius,
          boxShadow: look.shadowHard,
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: isVertical ? "stretch" : "center",
          gap,
        }}
      >
        {image && (
          <div
            style={{
              flex: "none",
              alignSelf: isVertical ? "flex-start" : "center",
              width: plateW,
              height: plateH,
              boxSizing: "border-box",
              border: "12px solid #EDEDE8",
              boxShadow: "0 24px 58px rgba(0,0,0,0.35)",
              overflow: "hidden",
              opacity: plateP,
              transform: `translateY(${mix(plateP, 20, 0)}px) rotate(-3deg)`,
              background: "#222",
            }}
          >
            <Img src={image} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)" }} />
          </div>
        )}
        {body}
      </div>
    </AbsoluteFill>
  );
};
