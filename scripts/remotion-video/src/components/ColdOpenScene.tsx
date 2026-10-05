/**
 * ColdOpenScene — the daily digest's opening, replacing the static title card.
 *
 * The owner noticed the first ~20 s of every video were the same still card
 * ("Daglig Nyhetsoppdatering" over generic site images) while the voice read the
 * teaser. Now the voice drives the picture:
 *   0 → greetingEnd   brand stamp (Dagens tek-nytt + date) over today's first photo
 *   greetingEnd → countStart   the top 2–3 stories, one hard cut each: the story's own
 *                    photo with a slow push-in and its headline punched in big
 *   countStart → end  "N saker i dag" over the three photos side by side
 * Times come from the intro voiceover's word timings (daily-compilation.js).
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, look, mix, punchScale, tween, wipeLR } from "./effects/motion/grammar";

export interface ColdOpenStory {
  headline: string;
  imageSrc: string;
  category?: string;
  accentColor?: string;
}

export interface ColdOpenSceneProps {
  date: string;
  stories: ColdOpenStory[];
  articleCount: number;
  greetingEndSeconds: number;
  countStartSeconds: number;
  accentColor: string;
  language?: string;
}

const resolveSrc = (src: string) => (src ? (src.startsWith("http") ? src : staticFile(src)) : "");

/** Font size that fits `text` (uppercase, heavy) on at most two lines of `maxW` px. */
function headlineSize(text: string, maxW: number, max = 132) {
  const perLine = Math.ceil(text.length / 2) + 2;
  return Math.round(Math.min(max, maxW / (perLine * 0.6)));
}

const Photo: React.FC<{ src: string; t0: number; t1: number; t: number; dim: number }> = ({ src, t0, t1, t, dim }) => {
  const p = tween(t, t0, Math.max(0.1, t1 - t0), ease.linear);
  const scale = mix(p, 1.04, 1.12);
  const url = resolveSrc(src);
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      {url && (
        <Img src={url} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      )}
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)" }} />
    </AbsoluteFill>
  );
};

export const ColdOpenScene: React.FC<ColdOpenSceneProps> = ({
  date,
  stories,
  articleCount,
  greetingEndSeconds,
  countStartSeconds,
  accentColor,
  language = "no",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const isV = height > width;
  const safeX = look.safeX;
  const textW = width - safeX * 2;

  const list = stories.filter((s) => s.headline).slice(0, 3);
  const gEnd = Math.min(Math.max(1.2, greetingEndSeconds), total - 0.5);
  const cStart = Math.min(Math.max(gEnd + 1, countStartSeconds), total);
  const per = list.length > 0 ? (cStart - gEnd) / list.length : 0;

  // ── 1. brand stamp ──
  if (t < gEnd || list.length === 0) {
    const first = list[0]?.imageSrc || stories[0]?.imageSrc || "";
    const s = punchScale(t, 0.16, 0.8, 1.03, 0.25, 0.18);
    const kick = tween(t, 0.55, 0.3, ease.expoOut);
    return (
      <AbsoluteFill>
        <Photo src={first} t0={0} t1={gEnd} t={t} dim={0.72} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <div style={{ fontFamily: look.mono, fontSize: 30, color: accentColor, letterSpacing: "0.12em", clipPath: wipeLR(kick), marginBottom: 18 }}>
            VITALII.NO
          </div>
          <div
            style={{
              fontFamily: look.font,
              fontWeight: 850,
              fontSize: isV ? 120 : 156,
              letterSpacing: look.tracking.hero,
              color: look.ink,
              transform: `scale(${s}) skewX(-4deg)`,
              opacity: t < 0.16 ? 0 : 1,
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {language === "no" ? "DAGENS TEK-NYTT" : "TODAY IN TECH"}
          </div>
          <div style={{ fontFamily: look.font, fontWeight: 500, fontSize: 44, color: look.muted, marginTop: 22, clipPath: wipeLR(kick) }}>
            {date}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ── 2. story teasers (hard cuts) ──
  if (t < cStart) {
    const i = Math.min(list.length - 1, Math.floor((t - gEnd) / per));
    const st = list[i];
    const t0 = gEnd + i * per;
    const acc = st.accentColor || accentColor;
    const text = st.headline.toUpperCase();
    const size = headlineSize(text, textW, isV ? 104 : 132);
    const s = punchScale(t, t0 + 0.12, 0.9, 1.025, 0.22, 0.16);
    const kick = tween(t, t0 + 0.12, 0.28, ease.expoOut);
    return (
      <AbsoluteFill>
        <Photo src={st.imageSrc} t0={t0} t1={t0 + per} t={t} dim={0.38} />
        <AbsoluteFill style={{ justifyContent: "flex-end", padding: `0 ${safeX}px ${look.safeBottom - 40}px` }}>
          <div style={{ fontFamily: look.mono, fontSize: 30, color: acc, letterSpacing: "0.1em", clipPath: wipeLR(kick), marginBottom: 16 }}>
            {`SAK ${i + 1}${st.category ? ` · ${st.category.toUpperCase()}` : ""}`}
          </div>
          <div
            style={{
              fontFamily: look.font,
              fontWeight: 850,
              fontSize: size,
              lineHeight: 1.02,
              letterSpacing: look.tracking.hero,
              color: look.ink,
              maxWidth: textW,
              transform: `scale(${s}) skewX(-4deg)`,
              transformOrigin: "0% 100%",
              textShadow: "0 4px 24px rgba(0,0,0,0.55)",
            }}
          >
            {text}
          </div>
          <div style={{ height: 8, width: 220, background: acc, marginTop: 26, clipPath: wipeLR(kick) }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ── 3. "N saker i dag" over the photos side by side ──
  const p = tween(t, cStart + 0.1, 0.35, ease.power3Out);
  const n = punchScale(t, cStart + 0.1, 0.8, 1.04, 0.24, 0.16);
  const cols = list.length;
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <AbsoluteFill style={{ flexDirection: isV ? "column" : "row" }}>
        {list.map((st, i) => (
          <div key={i} style={{ flex: 1, position: "relative", overflow: "hidden", opacity: mix(tween(t, cStart + i * 0.08, 0.3), 0, 1) }}>
            <Img src={resolveSrc(st.imageSrc)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.6)" }} />
            {i < cols - 1 && (
              <div style={{ position: "absolute", [isV ? "bottom" : "right"]: 0, [isV ? "left" : "top"]: 0, [isV ? "height" : "width"]: 4, [isV ? "width" : "height"]: "100%", background: "#0a0a0a" }} />
            )}
          </div>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.58)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: look.font, fontWeight: 850, fontSize: 260, lineHeight: 0.9, color: accentColor, letterSpacing: look.tracking.hero, transform: `scale(${n})`, opacity: t < cStart + 0.1 ? 0 : 1 }}>
          {articleCount}
        </div>
        <div style={{ fontFamily: look.font, fontWeight: 700, fontSize: 64, color: look.ink, marginTop: 10, clipPath: wipeLR(p) }}>
          {language === "no" ? "saker i dag" : "stories today"}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
