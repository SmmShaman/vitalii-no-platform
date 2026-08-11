/**
 * Reusable primitives for the "feature schema" diagram template:
 * Bg, SchemaNode, Connector (with draw-on), Token (glowing dot travelling a
 * polyline), Caption, Badge, Pill + small math helpers.
 */
import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { T, NodeState, stateColor, lerpColor, hexA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
export { fontFamily };

export type Pt = { x: number; y: number };

/** Clamped 0..1 progress between frames a..b. */
export const seg = (
  frame: number,
  a: number,
  b: number,
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
): number =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Fade toward the first frame's state over the last 15 frames (loop-friendly). */
export const loopFade = (frame: number, durationInFrames: number): number =>
  interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

const pathLengths = (pts: Pt[]) => {
  const d: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    d.push(d[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  return d;
};

/** Point at fraction t (0..1) along a polyline. */
export const pathPoint = (pts: Pt[], t: number): Pt => {
  const d = pathLengths(pts);
  const total = d[d.length - 1] || 1;
  const target = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 1; i < pts.length; i++) {
    if (target <= d[i]) {
      const span = d[i] - d[i - 1] || 1;
      const local = (target - d[i - 1]) / span;
      return {
        x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * local,
        y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * local,
      };
    }
  }
  return pts[pts.length - 1];
};

export const Bg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(160deg, ${T.bgTop} 0%, ${T.bgBottom} 100%)`,
      fontFamily,
    }}
  />
);

/** Rounded-xl node box with 1px border and soft glow when lit. */
export const SchemaNode: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  state?: NodeState;
  lit?: number; // 0..1 glow intensity
  opacity?: number;
  grayscale?: number; // 0..1
  fontSize?: number;
  labelColor?: string;
  children?: React.ReactNode;
}> = ({
  x,
  y,
  w,
  h,
  label,
  state = "idle",
  lit = 0,
  opacity = 1,
  grayscale = 0,
  fontSize = 28,
  labelColor,
  children,
}) => {
  const c = stateColor(state);
  const l = Math.min(1, Math.max(0, lit));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 16,
        border: `1px solid ${state === "idle" ? T.border : lerpColor(T.border, c, l * 0.95)}`,
        background: T.nodeFill,
        boxShadow:
          l > 0.01
            ? `0 0 ${30 * l}px ${hexA(c, 0.4 * l)}, inset 0 0 ${20 * l}px ${hexA(c, 0.1 * l)}`
            : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity,
        filter: grayscale > 0.01 ? `grayscale(${grayscale})` : undefined,
        fontFamily,
      }}
    >
      {label ? (
        <div
          style={{
            fontSize,
            fontWeight: 600,
            color: labelColor ?? (l > 0.5 && state !== "idle" ? lerpColor(T.text, c, 0.35) : T.text),
            letterSpacing: 0.3,
            textAlign: "center",
            lineHeight: 1.15,
            padding: "0 10px",
          }}
        >
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
};

/** Polyline connector with optional draw-on progress and arrowhead. */
export const Connector: React.FC<{
  pts: Pt[];
  color?: string;
  width?: number;
  opacity?: number;
  progress?: number; // 0..1 draw-on; default fully drawn
  arrow?: boolean;
  dashed?: boolean;
}> = ({ pts, color = T.border, width = 2, opacity = 1, progress = 1, arrow = false, dashed = false }) => {
  const d = pathLengths(pts);
  const total = d[d.length - 1] || 1;
  const points = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const tip = pathPoint(pts, Math.max(0.001, progress));
  const prev = pathPoint(pts, Math.max(0, progress - 0.02));
  const angle = (Math.atan2(tip.y - prev.y, tip.x - prev.x) * 180) / Math.PI;
  return (
    <svg
      width={1280}
      height={720}
      viewBox="0 0 1280 720"
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "6 8" : `${total}`}
        strokeDashoffset={dashed ? 0 : total * (1 - Math.min(1, Math.max(0, progress)))}
      />
      {arrow && progress > 0.02 ? (
        <polygon
          points="0,-7 12,0 0,7"
          fill={color}
          transform={`translate(${tip.x}, ${tip.y}) rotate(${angle})`}
        />
      ) : null}
    </svg>
  );
};

/** Small glowing dot travelling along a polyline. */
export const Token: React.FC<{
  pts: Pt[];
  t: number; // 0..1 along the path
  color?: string;
  opacity?: number;
  size?: number;
}> = ({ pts, t, color = T.accent, opacity = 1, size = 14 }) => {
  if (opacity <= 0.005) return null;
  const p = pathPoint(pts, t);
  return (
    <div
      style={{
        position: "absolute",
        left: p.x,
        top: p.y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, #ffffff, ${color} 60%)`,
        boxShadow: `0 0 14px 4px ${hexA(color, 0.75)}, 0 0 34px 10px ${hexA(color, 0.3)}`,
        opacity,
      }}
    />
  );
};

/** Text caption, centered inside a given box. */
export const Caption: React.FC<{
  x: number;
  y: number;
  w: number;
  text: string;
  color?: string;
  opacity?: number;
  fontSize?: number;
  weight?: number;
  align?: "left" | "center" | "right";
}> = ({ x, y, w, text, color = T.muted, opacity = 1, fontSize = 24, weight = 500, align = "center" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      fontSize,
      fontWeight: weight,
      color,
      opacity,
      textAlign: align,
      fontFamily,
      lineHeight: 1.3,
      letterSpacing: 0.2,
    }}
  >
    {text}
  </div>
);

/** Circular check / cross badge. */
export const Badge: React.FC<{
  x: number;
  y: number;
  kind: "check" | "cross";
  scale?: number;
  opacity?: number;
  size?: number;
}> = ({ x, y, kind, scale = 1, opacity = 1, size = 36 }) => {
  const color = kind === "check" ? T.success : T.danger;
  if (opacity <= 0.005 || scale <= 0.005) return null;
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
        background: color,
        color: "#151519",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.62,
        fontWeight: 700,
        boxShadow: `0 0 18px ${hexA(color, 0.55)}`,
        opacity,
        fontFamily,
      }}
    >
      {kind === "check" ? "✓" : "✕"}
    </div>
  );
};

/** Rounded pill / chip. */
export const Pill: React.FC<{
  x: number;
  y: number;
  text: string;
  color?: string; // border + text tint
  bg?: string;
  opacity?: number;
  fontSize?: number;
  dx?: number; // slide offset
  weight?: number;
}> = ({ x, y, text, color = T.accent, bg = T.nodeFillDeep, opacity = 1, fontSize = 24, dx = 0, weight = 600 }) => {
  if (opacity <= 0.005) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${dx}px)`,
        padding: `${fontSize * 0.35}px ${fontSize * 0.8}px`,
        borderRadius: 999,
        border: `1px solid ${hexA(color, 0.8)}`,
        background: bg,
        color: lerpColor(color, "#EAEAF0", 0.25),
        fontSize,
        fontWeight: weight,
        whiteSpace: "nowrap",
        boxShadow: `0 0 16px ${hexA(color, 0.18)}`,
        opacity,
        fontFamily,
        letterSpacing: 0.3,
      }}
    >
      {text}
    </div>
  );
};
