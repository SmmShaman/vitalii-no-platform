/**
 * SchemaTheme — shared dark design tokens for the feature-demo diagram clips.
 * Matches vitalii.no dark aesthetic.
 */
export const T = {
  bgTop: "#1a1a1f",
  bgBottom: "#232329",
  text: "#EAEAF0",
  muted: "#8A8A94",
  accent: "#6366F1",
  success: "#4ade80",
  danger: "#f87171",
  amber: "#fbbf24",
  border: "#3C3C44",
  nodeFill: "#26262d",
  nodeFillDeep: "#202026",
} as const;

export type NodeState = "idle" | "accent" | "success" | "danger" | "amber";

export const stateColor = (s: NodeState): string => {
  switch (s) {
    case "accent":
      return T.accent;
    case "success":
      return T.success;
    case "danger":
      return T.danger;
    case "amber":
      return T.amber;
    default:
      return T.border;
  }
};

/** Linear-interpolate two hex colors (#rrggbb) -> hex (#rrggbb), so the result stays hexA()-compatible. */
export const lerpColor = (a: string, b: string, t: number): string => {
  const cl = Math.min(1, Math.max(0, t));
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const out = pa.map((v, i) => Math.round(v + (pb[i] - v) * cl));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/** Hex (#rrggbb) or rgb(r,g,b) color -> rgba() string with alpha. */
export const hexA = (hex: string, alpha: number): string => {
  const a = Math.min(1, Math.max(0, alpha));
  if (hex.startsWith("rgb")) {
    const m = hex.match(/[\d.]+/g) || ["0", "0", "0"];
    return `rgba(${m[0]},${m[1]},${m[2]},${a})`;
  }
  const p = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${p[0]},${p[1]},${p[2]},${a})`;
};
