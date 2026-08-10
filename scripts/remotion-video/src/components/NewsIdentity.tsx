/**
 * NewsIdentity — what the viewer reads to know WHICH story this is.
 *
 * Before this, a segment was a photo, a moving line of narration text and
 * nothing else: no headline after the first three seconds, no source, no place,
 * no people. The eye had nothing to hold on to.
 *
 * Three pieces, all fed from the researched fact sheet:
 *   IdentityBar — persistent slim bar: headline · source · place
 *   FactStrip   — 2-3 short facts (who / where / figures), held long enough to read
 *   QuoteCard   — a verbatim quote with its speaker (only ever real quotes)
 */
import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { colors, typography, clampBoth } from "../design-system";

const FONT = typography.fontFamily.primary;

/** How well an outside search backed a fact up. */
export type FactStatus = "confirmed" | "single-source" | "conflicting";

export interface FactSheet {
  what?: string;
  who?: { name: string; role?: string; status?: FactStatus; sources?: string[] }[];
  where?: { place?: string; country?: string };
  when?: string;
  numbers?: { value: string; label: string; status?: FactStatus; sources?: string[] }[];
  quote?: { text: string; speaker?: string } | null;
  source?: string;
}

export interface FactLine {
  text: string;
  status?: FactStatus;
  sourceCount?: number;
}

// ── Identity bar ───────────────────────────────────────────────────

export const IdentityBar: React.FC<{
  headline: string;
  source?: string;
  place?: string;
  accentColor: string;
  isVertical?: boolean;
}> = ({ headline, source, place, accentColor, isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slide = spring({ frame, fps, config: { damping: 18, stiffness: 70 } });
  const out = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    clampBoth,
  );

  const meta = [source, place].filter(Boolean).join("  ·  ");

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: isVertical ? 200 : 74,
        display: "flex",
        alignItems: "stretch",
        opacity: out,
        transform: `translateX(${(1 - slide) * -40}px)`,
        zIndex: 7,
      }}
    >
      <div style={{ width: 8, background: accentColor }} />
      <div
        style={{
          flex: 1,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(10px)",
          padding: isVertical ? "12px 18px" : "12px 26px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: isVertical ? 30 : 34,
            fontWeight: 700,
            color: colors.text,
            fontFamily: FONT,
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {headline}
        </div>
        {meta ? (
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: colors.textMuted,
              fontFamily: FONT,
            }}
          >
            {meta}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ── Fact strip ─────────────────────────────────────────────────────

/** Digits only, so "100" and "100 ganger" compare equal. */
function numericKey(text: string): string {
  const m = String(text).replace(/\s/g, "").match(/\d[\d.,]*/);
  return m ? m[0].replace(/[.,]$/, "") : "";
}

/**
 * Turn a fact sheet into at most three short, readable lines.
 *
 * `cardValues` are figures already shown on a data card in this segment. The
 * 09.08 render printed "100 ganger høyere båndbredde" in the strip while a card
 * beside it showed "100" — the same fact twice.
 */
export function buildFactLines(
  sheet: FactSheet | undefined,
  cardValues: string[] = [],
): FactLine[] {
  if (!sheet) return [];
  const lines: FactLine[] = [];
  const onCard = new Set(cardValues.map(numericKey).filter(Boolean));

  for (const person of (sheet.who || []).slice(0, 2)) {
    if (person.status === "conflicting") continue;
    lines.push({
      text: person.role ? `${person.name} — ${person.role}` : person.name,
      status: person.status,
      sourceCount: person.sources?.length,
    });
  }

  const place = [sheet.where?.place, sheet.where?.country].filter(Boolean).join(", ");
  if (place) lines.push({ text: place });

  for (const n of (sheet.numbers || []).slice(0, 2)) {
    if (n.status === "conflicting") continue;
    if (onCard.has(numericKey(n.value))) continue; // already on a card
    lines.push({
      text: `${n.value} ${n.label}`,
      status: n.status,
      sourceCount: n.sources?.length,
    });
  }

  return lines.slice(0, 3);
}

export const FactStrip: React.FC<{
  lines: FactLine[];
  accentColor: string;
  isVertical?: boolean;
}> = ({ lines, accentColor, isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const out = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    clampBoth,
  );

  if (lines.length === 0) return null;

  return (
    <div
      style={{
        // Sits directly above the identity bar. The screen is zoned so pieces
        // never fight: narration top-left, data cards right, context bottom.
        position: "absolute",
        left: isVertical ? 24 : 64,
        bottom: isVertical ? 320 : 174,
        maxWidth: isVertical ? "80%" : "52%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        opacity: out,
        zIndex: 7,
      }}
    >
      {lines.map((line, i) => {
        const delay = i * 9;
        const pop = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 16, stiffness: 90 },
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              transform: `translateX(${(1 - pop) * -30}px)`,
              opacity: pop,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: accentColor,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: isVertical ? 28 : 30,
                fontWeight: 600,
                color: colors.text,
                fontFamily: FONT,
                textShadow: "0 2px 10px rgba(0,0,0,0.9)",
              }}
            >
              {line.text}
            </span>
            {/* Verification badge: a tick means another publisher says the same */}
            {line.status === "confirmed" && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 9px",
                  borderRadius: 6,
                  background: "rgba(47,181,111,0.18)",
                  border: "1px solid #2FB56F",
                  color: "#2FB56F",
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: FONT,
                  flexShrink: 0,
                }}
              >
                ✓{line.sourceCount ? ` ${line.sourceCount + 1}` : ""}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Quote card ─────────────────────────────────────────────────────

export const QuoteCard: React.FC<{
  text: string;
  speaker?: string;
  accentColor: string;
  isVertical?: boolean;
}> = ({ text, speaker, accentColor, isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 65 } });
  const out = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    clampBoth,
  );

  return (
    <div
      style={{
        position: "absolute",
        left: isVertical ? 24 : 90,
        right: isVertical ? 24 : 90,
        top: isVertical ? "30%" : "24%",
        opacity: out * enter,
        transform: `translateY(${(1 - enter) * 24}px)`,
        zIndex: 8,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.74)",
          backdropFilter: "blur(14px)",
          borderLeft: `6px solid ${accentColor}`,
          borderRadius: 12,
          padding: isVertical ? "24px 22px" : "30px 36px",
        }}
      >
        <div
          style={{
            fontSize: isVertical ? 34 : 40,
            fontWeight: 600,
            fontStyle: "italic",
            color: colors.text,
            fontFamily: FONT,
            lineHeight: 1.35,
          }}
        >
          &laquo;{text}&raquo;
        </div>
        {speaker ? (
          <div
            style={{
              marginTop: 16,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: accentColor,
              fontFamily: FONT,
            }}
          >
            {speaker}
          </div>
        ) : null}
      </div>
    </div>
  );
};
