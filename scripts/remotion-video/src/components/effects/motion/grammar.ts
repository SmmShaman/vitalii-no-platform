/**
 * Motion grammar for the digest-motion effects.
 *
 * Distilled from studying an editorial motion library (owner-licensed, study only):
 * beats live on ABSOLUTE seconds (first element at 0.16 s, the hold absorbs the
 * rest of the block), arrivals punch slightly past the target and settle without
 * oscillation, data grows with power2.out, text reveals with left→right clip wipes,
 * drawn strokes are linear, and the block ends on a still reading hold — the cut to
 * the next block is the exit, there is no fade-out.
 *
 * Our blocks are 2–6 s while the reference clips are 6–9 s, so a whole timeline is
 * compressed by one factor when it would not leave a reading hold (see `pace`).
 */

import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

// Fonts load once at module level (also on the GitHub runner, which has no Inter).
const inter = loadInter("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] });
const plexMono = loadPlexMono("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

// ── Easings (t in 0..1) ──
export const ease = {
  linear: (t: number) => t,
  power2Out: (t: number) => 1 - Math.pow(1 - t, 3),
  power3Out: (t: number) => 1 - Math.pow(1 - t, 4),
  power4Out: (t: number) => 1 - Math.pow(1 - t, 5),
  power3In: (t: number) => Math.pow(t, 4),
  expoOut: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  sineInOut: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  power3InOut: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
};
export type Ease = (t: number) => number;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Progress 0..1 of a tween that starts at `start` s and lasts `dur` s, eased. */
export function tween(t: number, start: number, dur: number, fn: Ease = ease.power3Out): number {
  if (dur <= 0) return t >= start ? 1 : 0;
  return fn(clamp01((t - start) / dur));
}

/** Linear map of an eased progress onto a value range. */
export const mix = (p: number, from: number, to: number) => from + (to - from) * p;

/**
 * Time base for an effect.
 * `build` = seconds the effect needs until its last element has landed (at full pace).
 * Returns `t` (seconds on the authored timeline) for the current frame: if the block
 * cannot hold the build plus ≥ `minHold` s of reading, the timeline runs faster
 * (never slower), so the reading hold always survives.
 */
export function pace(frame: number, fps: number, durationInFrames: number, build: number, minHold = 1.2) {
  const blockSec = Math.max(durationInFrames, 1) / fps;
  const room = Math.max(0.6, blockSec - minHold);
  const speed = build > room ? build / room : 1;
  return { t: (frame / fps) * speed, speed, blockSec };
}

/**
 * Punch + settle arrival: overshoot to `peak` with expo.out in `punch` s, then settle
 * to 1 with power2.out in `settle` s. Starts at `from` scale. Never oscillates.
 */
export function punchScale(t: number, start: number, from = 0.67, peak = 1.035, punch = 0.23, settle = 0.17) {
  if (t < start) return from;
  if (t < start + punch) return mix(tween(t, start, punch, ease.expoOut), from, peak);
  return mix(tween(t, start + punch, settle, ease.power2Out), peak, 1);
}

/** clip-path for a left→right wipe reveal (0 = hidden, 1 = fully shown). */
export const wipeLR = (p: number) => `inset(0 ${(1 - clamp01(p)) * 100}% 0 0)`;
/** clip-path for a top→down wipe reveal. */
export const wipeTD = (p: number) => `inset(0 0 ${(1 - clamp01(p)) * 100}% 0)`;

/** Number formatting: Norwegian separators, integers while counting large values. */
export function fmtNum(n: number, maxDecimals = 1): string {
  const decimals = Math.abs(n) >= 100 || Number.isInteger(n) ? 0 : maxDecimals;
  return n.toLocaleString("nb-NO", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
}

/** Parse "1,5 mrd", "35.1", 12 → number (NaN when absent). */
export function num(v: unknown): number {
  if (typeof v === "number") return v;
  return parseFloat(String(v ?? "").replace(/[^0-9.,-]/g, "").replace(",", "."));
}

/** Truncate a label to `n` characters with an ellipsis. */
export function clip(s: unknown, n = 28): string {
  const str = String(s ?? "").trim();
  return str.length > n ? str.slice(0, n - 1).trimEnd() + "…" : str;
}

/**
 * Visual tokens shared by every motion effect: print-like, no glass cards.
 * Dark canvas over a dimmed news photo, one orange accent for the changing element.
 */
export const look = {
  ink: "#F5F5F2",
  muted: "rgba(245,245,242,0.62)",
  faint: "rgba(245,245,242,0.32)",
  rule: "rgba(245,245,242,0.22)",
  surface: "rgba(14,14,14,0.86)",
  scrim: "rgba(0,0,0,0.42)",
  shadowHard: "6px 6px 0 rgba(0,0,0,0.55)",
  radius: 4,
  ruleW: 2,
  strokeW: 4,
  font: `${inter.fontFamily}, sans-serif`,
  mono: `${plexMono.fontFamily}, monospace`,
  safeX: 96,
  safeY: 80,
  /** the scene draws its lower third (story title + source) at y≈900–1000 */
  safeBottom: 200,
  minLabel: 24,
  tracking: { hero: "-0.035em", head: "-0.025em", body: "-0.01em" },
} as const;

/** Faded/dimmed opacity for non-focused items (focus by dimming, never by hiding). */
export const DIM = 0.38;

/** Category slugs are English; the show is Norwegian (and says KI, not AI). */
export const CATEGORY_NO: Record<string, string> = {
  tech: "Teknologi", ai: "KI", business: "Næringsliv", politics: "Politikk", startup: "Oppstart",
  science: "Vitenskap", crypto: "Krypto", health: "Helse", news: "Nyheter", growth: "Vekst",
};
export const categoryLabel = (c?: string, language = "no") =>
  !c ? "" : language === "no" ? CATEGORY_NO[c.toLowerCase()] ?? c : c;
