/**
 * DataViz — real data graphics for news segments.
 *
 * Replaces the old "one number in a box" panels with proper chart forms:
 * before/after comparison bars, a delta figure with direction, a series
 * bar chart and a share donut.
 *
 * Palette is validated for the dark video surface (categorical pair passes
 * lightness band, chroma floor, CVD separation and contrast):
 *   baseline #4E93C4  ·  highlight #E07000
 * Direction colors ship with an arrow glyph + sign, never color alone.
 */
import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { colors, typography, clampBoth } from "../design-system";

export const vizColors = {
  baseline: "#4E93C4",
  highlight: "#E07000",
  up: "#2FB56F",
  down: "#E14B52",
  grid: "rgba(255,255,255,0.14)",
} as const;

const FONT = typography.fontFamily.primary;

// ── Numeric parsing ────────────────────────────────────────────────

const SCALE_WORDS: [RegExp, number][] = [
  [/milliard|billion/i, 1e9],
  [/million|millioner|mill\b/i, 1e6],
  [/tusen|thousand/i, 1e3],
];

/** Pull a comparable magnitude out of a display string ("50 millioner kr" → 5e7). */
export function parseNumeric(raw: unknown): number {
  if (typeof raw === "number") return raw;
  const s = String(raw ?? "");
  const m = s.replace(/\s/g, "").match(/-?\d+[.,]?\d*/);
  if (!m) return 0;
  let n = parseFloat(m[0].replace(",", "."));
  for (const [re, mult] of SCALE_WORDS) {
    if (re.test(s)) {
      n *= mult;
      break;
    }
  }
  return n;
}

/** Percent change between two magnitudes, or null when it is not meaningful. */
export function deltaPercent(from: number, to: number): number | null {
  if (!isFinite(from) || !isFinite(to) || from === 0) return null;
  const d = ((to - from) / Math.abs(from)) * 100;
  if (!isFinite(d) || Math.abs(d) < 0.5) return null;
  return Math.round(d);
}

// ── Shared bits ────────────────────────────────────────────────────

const Label: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 20,
}) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 600,
      color: colors.textMuted,
      fontFamily: FONT,
      letterSpacing: 0.4,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

/** Direction badge: arrow + signed percent. Never color alone. */
const DeltaBadge: React.FC<{ pct: number; delay?: number }> = ({
  pct,
  delay = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.6 },
  });
  const up = pct >= 0;
  const color = up ? vizColors.up : vizColors.down;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 10,
        background: `${color}22`,
        border: `2px solid ${color}`,
        transform: `scale(${pop})`,
      }}
    >
      <span style={{ fontSize: 26, lineHeight: 1, color }}>
        {up ? "▲" : "▼"}
      </span>
      <span
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: colors.text,
          fontFamily: FONT,
        }}
      >
        {up ? "+" : ""}
        {pct}%
      </span>
    </div>
  );
};

// ── Before / After comparison ──────────────────────────────────────

export interface BeforeAfterProps {
  left: { label: string; value: string };
  right: { label: string; value: string };
  accentColor?: string;
}

export const BeforeAfterChart: React.FC<BeforeAfterProps> = ({
  left,
  right,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const a = parseNumeric(left.value);
  const b = parseNumeric(right.value);
  const max = Math.max(a, b, 1);
  const pct = deltaPercent(a, b);

  const rows = [
    { ...left, mag: a, color: vizColors.baseline },
    { ...right, mag: b, color: vizColors.highlight },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {rows.map((row, i) => {
        const delay = 4 + i * 8;
        const grow = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 16, stiffness: 70 },
        });
        const width = Math.max(4, (row.mag / max) * 100 * grow);
        const valueOpacity = interpolate(
          frame - delay - 8,
          [0, 8],
          [0, 1],
          clampBoth,
        );
        return (
          <div key={i}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 8,
              }}
            >
              <Label>{row.label}</Label>
              <span
                style={{
                  opacity: valueOpacity,
                  fontSize: 34,
                  fontWeight: 800,
                  color: colors.text,
                  fontFamily: FONT,
                }}
              >
                {row.value}
              </span>
            </div>
            {/* Track keeps both bars on one scale; 2px gap to the surface */}
            <div
              style={{
                width: "100%",
                height: 18,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  width: `${width}%`,
                  height: "100%",
                  background: row.color,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        );
      })}

      {pct !== null && (
        <div style={{ marginTop: 4 }}>
          <DeltaBadge pct={pct} delay={22} />
        </div>
      )}
    </div>
  );
};

// ── Hero figure with optional direction ────────────────────────────

export interface DeltaFigureProps {
  value: string;
  label?: string;
  /** Signed percent change; renders the arrow badge when present */
  changePct?: number | null;
  accentColor?: string;
}

export const DeltaFigure: React.FC<DeltaFigureProps> = ({
  value,
  label,
  changePct,
  accentColor = vizColors.highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const target = parseNumeric(value);
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const count = interpolate(frame, [0, 22], [0, 1], clampBoth);

  // Count up only for plain numbers; keep formatted strings ("50 mill. kr") intact
  const isPlain = /^-?[\d\s.,]+%?$/.test(value.trim());
  const display = isPlain
    ? formatCount(target * count, value.trim().endsWith("%"))
    : value;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          fontSize: 88,
          fontWeight: 800,
          lineHeight: 1,
          color: colors.text,
          fontFamily: FONT,
          transform: `scale(${0.9 + pop * 0.1})`,
          transformOrigin: "left center",
        }}
      >
        {display}
      </div>
      <div
        style={{
          width: 72,
          height: 4,
          borderRadius: 2,
          background: accentColor,
        }}
      />
      {label ? <Label size={22}>{label}</Label> : null}
      {changePct != null && (
        <div style={{ marginTop: 4 }}>
          <DeltaBadge pct={changePct} delay={16} />
        </div>
      )}
    </div>
  );
};

function formatCount(n: number, isPct: boolean): string {
  const rounded = Math.abs(n) >= 100 ? Math.round(n) : Math.round(n * 10) / 10;
  const s = rounded.toLocaleString("nb-NO");
  return isPct ? `${s}%` : s;
}

// ── Series bar chart ───────────────────────────────────────────────

export interface SeriesBarChartProps {
  items: { label: string; value: string | number }[];
  accentColor?: string;
}

export const SeriesBarChart: React.FC<SeriesBarChartProps> = ({
  items,
  accentColor = vizColors.highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rows = items.slice(0, 4).map((it) => ({
    label: it.label,
    display: String(it.value),
    mag: parseNumeric(it.value),
  }));
  const max = Math.max(...rows.map((r) => r.mag), 1);
  // Highest bar carries the highlight hue; the rest stay on the baseline hue
  const topMag = max;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {rows.map((row, i) => {
        const delay = 4 + i * 6;
        const grow = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 16, stiffness: 70 },
        });
        const width = Math.max(3, (row.mag / max) * 100 * grow);
        const color = row.mag === topMag ? accentColor : vizColors.baseline;
        const valueOpacity = interpolate(
          frame - delay - 6,
          [0, 8],
          [0, 1],
          clampBoth,
        );
        return (
          <div key={i}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 6,
              }}
            >
              <Label size={18}>{row.label}</Label>
              <span
                style={{
                  opacity: valueOpacity,
                  fontSize: 26,
                  fontWeight: 800,
                  color: colors.text,
                  fontFamily: FONT,
                }}
              >
                {row.display}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 14,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  width: `${width}%`,
                  height: "100%",
                  background: color,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Share donut (part of a whole) ──────────────────────────────────

export interface ShareDonutProps {
  percent: number;
  label?: string;
  accentColor?: string;
}

export const ShareDonut: React.FC<ShareDonutProps> = ({
  percent,
  label,
  accentColor = vizColors.highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const grow = spring({ frame, fps, config: { damping: 18, stiffness: 60 } });
  const shown = Math.max(0, Math.min(100, percent)) * grow;

  const size = 220;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (shown / 100) * circumference;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accentColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill={colors.text}
          fontFamily={FONT}
          fontWeight={800}
          fontSize={54}
        >
          {Math.round(shown)}%
        </text>
      </svg>
      {label ? (
        <div style={{ maxWidth: 260 }}>
          <Label size={22}>{label}</Label>
        </div>
      ) : null}
    </div>
  );
};
