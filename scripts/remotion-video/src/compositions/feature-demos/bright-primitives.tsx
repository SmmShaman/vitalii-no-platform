/**
 * Bright infographic primitives — the light "explain it to a non-technical
 * viewer" template for feature demo clips. Visual language borrowed from the
 * static promo infographics: problem/solution color zones, a realistic
 * browser+table mockup with REAL project data, filter chips, a toggle,
 * emoji icon cards, big before→after metrics, an animated cursor.
 *
 * Layout constants assume 1280x720. Reuses seg/loopFade math from the dark
 * template so beat timing code looks identical across both styles.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { B, Tone, toneBg, toneEdge, cardShadow } from "./bright-theme";
import { seg, loopFade, fontFamily } from "./primitives";

export { seg, loopFade, fontFamily };

/** Soft light gradient + faint dot grid. */
export const LightBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(165deg, ${B.bgTop} 0%, ${B.bgBottom} 100%)`,
      fontFamily,
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${B.border} 1.2px, transparent 1.2px)`,
        backgroundSize: "36px 36px",
        opacity: 0.5,
      }}
    />
  </AbsoluteFill>
);

/** Full-frame group for one story beat (fade/slide as a unit). */
export const Group: React.FC<{ opacity?: number; dy?: number; children?: React.ReactNode }> = ({
  opacity = 1,
  dy = 0,
  children,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <AbsoluteFill style={{ opacity, transform: dy ? `translateY(${dy}px)` : undefined, fontFamily }}>
      {children}
    </AbsoluteFill>
  );
};

/** Big centered headline near the top. */
export const Headline: React.FC<{
  y?: number;
  text: string;
  accentText?: string; // optional colored tail
  accentColor?: string;
  opacity?: number;
  fontSize?: number;
}> = ({ y = 42, text, accentText, accentColor = B.accent, opacity = 1, fontSize = 36 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: y,
      width: 1280,
      textAlign: "center",
      fontSize,
      fontWeight: 700,
      color: B.ink,
      opacity,
      letterSpacing: 0.2,
      fontFamily,
    }}
  >
    {text}
    {accentText ? <span style={{ color: accentColor }}> {accentText}</span> : null}
  </div>
);

/** Rounded tinted panel (problem = danger, solution = success, etc). */
export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: Tone;
  opacity?: number;
  radius?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, tone = "card", opacity = 1, radius = 20, children }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        background: toneBg(tone),
        border: `1.5px solid ${toneEdge(tone)}`,
        boxShadow: cardShadow,
        opacity,
        fontFamily,
      }}
    >
      {children}
    </div>
  );
};

/** Browser window chrome (traffic lights + URL bar) with clipped content. */
export const BrowserWindow: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  opacity?: number;
  scale?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, title = "", opacity = 1, scale = 1, children }) => {
  if (opacity <= 0.004) return null;
  const bar = 42;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 16,
        background: B.card,
        border: `1.5px solid ${B.border}`,
        boxShadow: cardShadow,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        overflow: "hidden",
        fontFamily,
      }}
    >
      <div
        style={{
          height: bar,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          borderBottom: `1.5px solid ${B.border}`,
          background: "#F4F7FC",
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
        ))}
        <div
          style={{
            marginLeft: 12,
            flex: 1,
            height: 24,
            borderRadius: 12,
            background: B.chipBg,
            border: `1px solid ${B.border}`,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            fontSize: 13,
            fontWeight: 600,
            color: B.muted,
            letterSpacing: 0.2,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: bar, right: 0, bottom: 0, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

/** Endless gray skeleton rows scrolling upward — "an unreadable wall of data". */
export const SkeletonScroll: React.FC<{ w: number; h: number; offset: number; rowH?: number }> = ({
  w,
  h,
  offset,
  rowH = 44,
}) => {
  const count = Math.ceil(h / rowH) + 2;
  const shift = offset % rowH;
  return (
    <div style={{ position: "absolute", left: 0, top: -shift, width: w }}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            height: rowH,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 18px",
            borderBottom: `1px solid ${B.border}`,
            opacity: 0.9,
          }}
        >
          {[0.24, 0.16, 0.1, 0.07, 0.1, 0.09].map((f, j) => (
            <div
              key={j}
              style={{
                width: w * f,
                height: 12,
                borderRadius: 6,
                background: j === 3 ? "#E5D9B8" : "#E3E9F2",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export type JobRow = {
  role: string;
  company: string;
  city: string;
  score: number;
  source: string;
  status: string;
  statusTone?: "accent" | "success";
};

/** Realistic results table with real-looking rows, staggered entrance. */
export const JobsTable: React.FC<{
  w: number;
  rows: JobRow[];
  frame: number;
  appearStart: number;
  stagger?: number;
}> = ({ w, rows, frame, appearStart, stagger = 9 }) => {
  const cols = [0.27, 0.17, 0.11, 0.11, 0.13, 0.21];
  const heads = ["Position", "Company", "City", "Score", "Source", "Status"];
  const cell = (f: number): React.CSSProperties => ({
    width: w * f - 14,
    overflow: "hidden",
    whiteSpace: "nowrap",
  });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, fontFamily }}>
      <div
        style={{
          display: "flex",
          padding: "10px 18px",
          gap: 14,
          background: "#F4F7FC",
          borderBottom: `1.5px solid ${B.border}`,
          fontSize: 14,
          fontWeight: 700,
          color: B.muted,
          letterSpacing: 0.4,
        }}
      >
        {heads.map((hd, i) => (
          <div key={hd} style={cell(cols[i])}>
            {hd}
          </div>
        ))}
      </div>
      {rows.map((r, i) => {
        const t = seg(frame, appearStart + i * stagger, appearStart + i * stagger + 12);
        return (
          <div
            key={r.role}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "9px 18px",
              gap: 14,
              borderBottom: `1px solid ${B.border}`,
              fontSize: 15.5,
              color: B.ink,
              opacity: t,
              transform: `translateX(${(1 - t) * 26}px)`,
            }}
          >
            <div style={{ ...cell(cols[0]), fontWeight: 600 }}>{r.role}</div>
            <div style={{ ...cell(cols[1]), color: B.muted, fontWeight: 500 }}>{r.company}</div>
            <div style={{ ...cell(cols[2]), color: B.muted, fontWeight: 500 }}>{r.city}</div>
            <div style={cell(cols[3])}>
              <span
                style={{
                  display: "inline-block",
                  minWidth: 40,
                  textAlign: "center",
                  padding: "2px 8px",
                  borderRadius: 8,
                  background: B.successBg,
                  border: `1px solid ${toneEdge("success")}`,
                  color: B.success,
                  fontWeight: 700,
                  fontSize: 14.5,
                }}
              >
                {r.score}
              </span>
            </div>
            <div style={{ ...cell(cols[4]), color: B.muted, fontWeight: 500 }}>{r.source}</div>
            <div style={cell(cols[5])}>
              <span
                style={{
                  padding: "2.5px 10px",
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: r.statusTone === "success" ? B.successBg : B.accentBg,
                  border: `1px solid ${toneEdge(r.statusTone === "success" ? "success" : "accent")}`,
                  color: r.statusTone === "success" ? B.success : B.accent,
                }}
              >
                {r.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Rounded filter chip with a ✕, pops in with scale. */
export const FilterChip: React.FC<{
  x: number;
  y: number;
  text: string;
  icon?: string;
  scale?: number;
  opacity?: number;
  color?: string;
}> = ({ x, y, text, icon = "✕", scale = 1, opacity = 1, color = B.accent }) => {
  if (opacity <= 0.004 || scale <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        padding: "7px 16px",
        borderRadius: 999,
        background: B.card,
        border: `1.5px solid ${color}`,
        color,
        fontSize: 18,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: 9,
        boxShadow: cardShadow,
        whiteSpace: "nowrap",
        opacity,
        fontFamily,
      }}
    >
      {text}
      <span style={{ fontSize: 14, opacity: 0.65 }}>{icon}</span>
    </div>
  );
};

/** iOS-style toggle with a label; `on` is 0..1 animated. */
export const ToggleSwitch: React.FC<{
  x: number;
  y: number;
  label: string;
  on: number;
  opacity?: number;
}> = ({ x, y, label, on, opacity = 1 }) => {
  if (opacity <= 0.004) return null;
  const w = 52;
  const knob = 22;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, color: B.ink, whiteSpace: "nowrap" }}>{label}</div>
      <div
        style={{
          width: w,
          height: 28,
          borderRadius: 999,
          background: on > 0.5 ? B.success : "#C9D3E2",
          transition: "none",
          position: "relative",
          boxShadow: "inset 0 1px 3px rgba(22,35,63,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: 3 + on * (w - knob - 6),
            width: knob,
            height: knob,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(22,35,63,0.35)",
          }}
        />
      </div>
    </div>
  );
};

/** Emoji stat pill: colored border, emoji + text. */
export const StatPill: React.FC<{
  x: number;
  y: number;
  emoji: string;
  text: string;
  tone?: Tone;
  opacity?: number;
  scale?: number;
  fontSize?: number;
}> = ({ x, y, emoji, text, tone = "danger", opacity = 1, scale = 1, fontSize = 19 }) => {
  if (opacity <= 0.004 || scale <= 0.004) return null;
  const c = tone === "danger" ? B.danger : tone === "success" ? B.success : B.accent;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: `${fontSize * 0.4}px ${fontSize * 0.85}px`,
        borderRadius: 999,
        background: toneBg(tone),
        border: `1.5px solid ${toneEdge(tone)}`,
        color: c,
        fontSize,
        fontWeight: 700,
        whiteSpace: "nowrap",
        boxShadow: cardShadow,
        opacity,
        fontFamily,
      }}
    >
      <span style={{ fontSize: fontSize * 1.25 }}>{emoji}</span>
      {text}
    </div>
  );
};

/** Emoji-in-circle icon card with title + subtitle ("how it works" strip). */
export const IconCard: React.FC<{
  x: number;
  y: number;
  w: number;
  emoji: string;
  title: string;
  sub?: string;
  tone?: Tone;
  opacity?: number;
  scale?: number;
}> = ({ x, y, w, emoji, title, sub, tone = "accent", opacity = 1, scale = 1 }) => {
  if (opacity <= 0.004 || scale <= 0.004) return null;
  const c = tone === "danger" ? B.danger : tone === "success" ? B.success : B.accent;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        transform: `scale(${scale})`,
        transformOrigin: "center top",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity,
        fontFamily,
      }}
    >
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 30,
          background: toneBg(tone),
          border: `2px solid ${toneEdge(tone)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 56,
          boxShadow: cardShadow,
        }}
      >
        {emoji}
      </div>
      <div style={{ fontSize: 23, fontWeight: 700, color: B.ink, textAlign: "center", lineHeight: 1.25 }}>{title}</div>
      {sub ? (
        <div style={{ fontSize: 17.5, fontWeight: 600, color: c, textAlign: "center", lineHeight: 1.3 }}>{sub}</div>
      ) : null}
    </div>
  );
};

/** Chunky horizontal arrow that draws on (progress 0..1). */
export const FlowArrow: React.FC<{
  x: number;
  y: number;
  len: number;
  progress?: number;
  color?: string;
  opacity?: number;
}> = ({ x, y, len, progress = 1, color = B.accent, opacity = 1 }) => {
  if (opacity <= 0.004 || progress <= 0.004) return null;
  const shaft = Math.max(2, (len - 18) * progress);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, display: "flex", alignItems: "center" }}>
      <div style={{ width: shaft, height: 7, borderRadius: 4, background: color }} />
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "12px solid transparent",
          borderBottom: "12px solid transparent",
          borderLeft: `18px solid ${color}`,
          opacity: progress > 0.85 ? 1 : 0,
        }}
      />
    </div>
  );
};

/** Yellow sticky note with a 📌 and plain-language text. */
export const StickyNote: React.FC<{
  x: number;
  y: number;
  w: number;
  text: string;
  opacity?: number;
  rotate?: number;
}> = ({ x, y, w, text, opacity = 1, rotate = -2 }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        transform: `rotate(${rotate}deg)`,
        padding: "26px 22px 20px",
        borderRadius: 6,
        background: B.noteBg,
        border: `1.5px solid ${B.noteBorder}`,
        boxShadow: "0 8px 22px rgba(120,95,10,0.18)",
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 1.4,
        color: "#4A3E10",
        opacity,
        fontFamily,
      }}
    >
      <div style={{ position: "absolute", top: -16, left: w / 2 - 12, fontSize: 30 }}>📌</div>
      {text}
    </div>
  );
};

/** Mouse cursor with an optional click ripple (click 0..1). */
export const Cursor: React.FC<{ x: number; y: number; opacity?: number; click?: number }> = ({
  x,
  y,
  opacity = 1,
  click = 0,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, pointerEvents: "none" }}>
      {click > 0.004 && click < 0.996 ? (
        <div
          style={{
            position: "absolute",
            left: -6 - click * 26,
            top: -6 - click * 26,
            width: 12 + click * 52,
            height: 12 + click * 52,
            borderRadius: "50%",
            border: `3px solid ${B.accent}`,
            opacity: (1 - click) * 0.7,
          }}
        />
      ) : null}
      <svg width={30} height={34} viewBox="0 0 30 34" style={{ filter: "drop-shadow(0 2px 4px rgba(22,35,63,0.4))" }}>
        <path d="M2 1 L2 24 L8.5 18.5 L13 29 L17.5 27 L13 16.8 L21.5 16 Z" fill="#16233F" stroke="#fff" strokeWidth={1.8} />
      </svg>
    </div>
  );
};

/** Big green check in a circle. */
export const CheckBadge: React.FC<{ x: number; y: number; scale?: number; opacity?: number; size?: number }> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
  size = 46,
}) => {
  if (opacity <= 0.004 || scale <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `scale(${scale})`,
        borderRadius: "50%",
        background: B.success,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.55,
        fontWeight: 800,
        boxShadow: `0 6px 18px rgba(24,154,74,0.45)`,
        opacity,
        fontFamily,
      }}
    >
      ✓
    </div>
  );
};

/** Bottom caption band (plain-language sentence for the beat). */
export const CaptionBand: React.FC<{
  y?: number;
  text: string;
  tone?: Tone;
  opacity?: number;
  fontSize?: number;
}> = ({ y = 646, text, tone = "card", opacity = 1, fontSize = 23 }) => {
  if (opacity <= 0.004) return null;
  const c = tone === "danger" ? B.danger : tone === "success" ? B.success : tone === "accent" ? B.accent : B.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: y,
        width: 1100,
        textAlign: "center",
        fontSize,
        fontWeight: 650,
        color: c,
        opacity,
        lineHeight: 1.3,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};
