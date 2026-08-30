/**
 * BrightTheme — light "explainer infographic" tokens for audience-facing
 * feature demo clips (non-technical viewer). Counterpart of the dark schema
 * theme in ./theme.ts — pick ONE per clip, never mix.
 *
 * ART-DIRECTION MOODS (2026-08-30). `B` is the original palette ("dawn") and
 * stays the default, so every clip written before this date renders byte-for-
 * byte as before. New clips pick a mood with `moodFor(<feature id>)` and wrap
 * their tree in `<PaletteProvider value={P}>` — every primitive then reads the
 * mood from context instead of the hardcoded palette.
 */
import React from "react";

export type Palette = {
  bgTop: string;
  bgBottom: string;
  ink: string;
  muted: string;
  accent: string;
  accentBg: string;
  accentEdge: string;
  success: string;
  successBg: string;
  successEdge: string;
  danger: string;
  dangerBg: string;
  dangerEdge: string;
  amber: string;
  noteBg: string;
  noteBorder: string;
  card: string;
  border: string;
  chipBg: string;
};

/** "dawn" — the original bright palette (default; do not change). */
export const B: Palette = {
  bgTop: "#F7F9FD",
  bgBottom: "#E9EFF9",
  ink: "#16233F", // primary text (dark navy)
  muted: "#5B6B85",
  accent: "#2563EB",
  accentBg: "#E8F0FE",
  accentEdge: "#C4D7FB",
  success: "#189A4A",
  successBg: "#E6F7EC",
  successEdge: "#BFE7CD",
  danger: "#DC2F3E",
  dangerBg: "#FDEBED",
  dangerEdge: "#F3C2C7",
  amber: "#F59E0B",
  noteBg: "#FFF6C2",
  noteBorder: "#E7CF6B",
  card: "#FFFFFF",
  border: "#D9E2F0",
  chipBg: "#F1F5FB",
} as const;

/** Warm paper / terracotta. */
const sand: Palette = {
  bgTop: "#FDF8F1", bgBottom: "#F3E7D6", ink: "#2A2018", muted: "#7A6A57",
  accent: "#B4531F", accentBg: "#FAE8DC", accentEdge: "#EBC7AC",
  success: "#4F7A2F", successBg: "#EEF4E1", successEdge: "#CBDDAF",
  danger: "#B3242E", dangerBg: "#F9E4E3", dangerEdge: "#EEBFBD",
  amber: "#D08A00", noteBg: "#FFF3C8", noteBorder: "#E0C271",
  card: "#FFFFFF", border: "#E6D8C4", chipBg: "#F7F0E5",
};

/** Cool graphite / cyan. */
const slate: Palette = {
  bgTop: "#F5F7FA", bgBottom: "#E1E7EF", ink: "#101828", muted: "#5C6B7E",
  accent: "#0E7490", accentBg: "#DFF1F6", accentEdge: "#B6DCE7",
  success: "#0F766E", successBg: "#E1F4F1", successEdge: "#B3DED7",
  danger: "#B42318", dangerBg: "#FCE7E4", dangerEdge: "#F0C2BC",
  amber: "#B54708", noteBg: "#FEF3C7", noteBorder: "#DCC169",
  card: "#FFFFFF", border: "#D5DDE7", chipBg: "#EFF3F8",
};

/** Fresh green / teal. */
const mint: Palette = {
  bgTop: "#F4FBF6", bgBottom: "#DEF0E6", ink: "#10281D", muted: "#4F6B5C",
  accent: "#0B7A5A", accentBg: "#DDF2E9", accentEdge: "#B2DECC",
  success: "#157F3B", successBg: "#E3F6E7", successEdge: "#B8E3C1",
  danger: "#C0392B", dangerBg: "#FBE6E2", dangerEdge: "#F0C3BB",
  amber: "#C77700", noteBg: "#FFF7CE", noteBorder: "#DFC96F",
  card: "#FFFFFF", border: "#CFE4D8", chipBg: "#EDF6F0",
};

/** Indigo / plum. */
const violet: Palette = {
  bgTop: "#F8F7FE", bgBottom: "#E8E4F9", ink: "#1B1740", muted: "#615C88",
  accent: "#5B37D4", accentBg: "#E9E3FC", accentEdge: "#CDC1F3",
  success: "#16794F", successBg: "#E3F4EB", successEdge: "#B6DFC9",
  danger: "#C22A5B", dangerBg: "#FBE5EB", dangerEdge: "#F0BFCE",
  amber: "#C98A06", noteBg: "#FFF4CC", noteBorder: "#DCC46E",
  card: "#FFFFFF", border: "#DCD7F0", chipBg: "#F2EFFB",
};

export const MOODS = { dawn: B, sand, slate, mint, violet } as const;
export type MoodName = keyof typeof MOODS;
export const MOOD_NAMES: MoodName[] = ["dawn", "sand", "slate", "mint", "violet"];

/** Deterministic mood for a feature id / slug — same feature always same mood. */
export const moodFor = (seed: string): Palette => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return MOODS[MOOD_NAMES[h % MOOD_NAMES.length]];
};

/** Palette in effect for the current subtree (defaults to "dawn"). */
export const PaletteCtx = React.createContext<Palette>(B);
export const PaletteProvider = PaletteCtx.Provider;
export const usePalette = (): Palette => React.useContext(PaletteCtx);

export type Tone = "card" | "danger" | "success" | "accent" | "note";

export const toneBg = (t: Tone, P: Palette = B): string => {
  switch (t) {
    case "danger":
      return P.dangerBg;
    case "success":
      return P.successBg;
    case "accent":
      return P.accentBg;
    case "note":
      return P.noteBg;
    default:
      return P.card;
  }
};

export const toneEdge = (t: Tone, P: Palette = B): string => {
  switch (t) {
    case "danger":
      return P.dangerEdge;
    case "success":
      return P.successEdge;
    case "accent":
      return P.accentEdge;
    case "note":
      return P.noteBorder;
    default:
      return P.border;
  }
};

export const cardShadow = "0 10px 30px rgba(22,35,63,0.10)";
