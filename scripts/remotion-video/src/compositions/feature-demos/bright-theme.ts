/**
 * BrightTheme — light "explainer infographic" tokens for audience-facing
 * feature demo clips (non-technical viewer). Counterpart of the dark schema
 * theme in ./theme.ts — pick ONE per clip, never mix.
 */
export const B = {
  bgTop: "#F7F9FD",
  bgBottom: "#E9EFF9",
  ink: "#16233F", // primary text (dark navy)
  muted: "#5B6B85",
  accent: "#2563EB",
  accentBg: "#E8F0FE",
  success: "#189A4A",
  successBg: "#E6F7EC",
  danger: "#DC2F3E",
  dangerBg: "#FDEBED",
  amber: "#F59E0B",
  noteBg: "#FFF6C2",
  noteBorder: "#E7CF6B",
  card: "#FFFFFF",
  border: "#D9E2F0",
  chipBg: "#F1F5FB",
} as const;

export type Tone = "card" | "danger" | "success" | "accent" | "note";

export const toneBg = (t: Tone): string => {
  switch (t) {
    case "danger":
      return B.dangerBg;
    case "success":
      return B.successBg;
    case "accent":
      return B.accentBg;
    case "note":
      return B.noteBg;
    default:
      return B.card;
  }
};

export const toneEdge = (t: Tone): string => {
  switch (t) {
    case "danger":
      return "#F3C2C7";
    case "success":
      return "#BFE7CD";
    case "accent":
      return "#C4D7FB";
    case "note":
      return B.noteBorder;
    default:
      return B.border;
  }
};

export const cardShadow = "0 10px 30px rgba(22,35,63,0.10)";
