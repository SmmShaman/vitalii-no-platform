// FeatureLowSugarSirenFlashesD18 — feature d18 — 1280x720, 930 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood dawn.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { LiveBackdrop } from "./motion-primitives";
import { MotionInsert, cut } from "./motion-primitives";
import shotsFile from "./shots/d18.json";

const B1 = 15;
const B2 = 178;
const B3 = 330;
const B4 = 461;
const B5 = 605;
const B6 = 735;
const END = 930;

const ACCENT = "#C4342B";

// Persistent archetype-5 "ledger" strip: thin status band during effect beats,
// a full receipt card during the two drawn beats (b3 result-less, b6 final result).
const LEDGER_ROWS_RED = [
  { label: "Clock page open", status: "Alert visible" },
  { label: "YouTube or any other app open", status: "Alert hidden" },
  { label: "TV stick reboots", status: "Alert gone" },
];
const LEDGER_ROWS_GREEN = [
  { label: "Clock page open", status: "Flash shows" },
  { label: "YouTube or any other app open", status: "Flash shows" },
  { label: "TV stick reboots", status: "Flash restarts itself" },
];

const Ledger: React.FC<{ expanded: boolean; settled: boolean; rowIndex?: number }> = ({
  expanded,
  settled,
  rowIndex = 0,
}) => {
  const p = usePalette();
  const rows = settled ? LEDGER_ROWS_GREEN : LEDGER_ROWS_RED;
  const tone = settled ? p.success : p.danger;
  const toneBg = settled ? p.successBg : p.dangerBg;
  const toneEdge = settled ? p.successEdge : p.dangerEdge;
  const stripRow = rows[rowIndex % rows.length];

  const box = expanded
    ? { x: 190, y: 150, w: 900, h: 420 }
    : { x: 40, y: 606, w: 1200, h: 92 };

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: 18,
        background: p.card,
        border: `2px solid ${toneEdge}`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
        padding: expanded ? "28px 32px" : "14px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: expanded ? "flex-start" : "center",
        gap: expanded ? 14 : 6,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {expanded && (
        <div style={{ fontSize: 30, fontWeight: 800, color: p.ink, marginBottom: 6 }}>
          {settled ? "SirenService — now" : "Low-sugar alert — before"}
        </div>
      )}
      {(expanded ? rows : [stripRow]).map((row, i) => (
        <div
          key={row.label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: expanded ? 22 : 18,
            color: p.ink,
            borderBottom: expanded && i < rows.length - 1 ? `1px solid ${p.border}` : "none",
            paddingBottom: expanded ? 10 : 0,
          }}
        >
          <span style={{ color: p.muted }}>{row.label}</span>
          <span
            style={{
              fontWeight: 700,
              color: tone,
              background: toneBg,
              borderRadius: 8,
              padding: "4px 12px",
              textDecoration: settled && !expanded ? "none" : undefined,
            }}
          >
            {row.status}
          </span>
        </div>
      ))}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: usePalette().bgTop }}>
      {/* Product plate, beat 1: name the product as a small label, never full-screen. */}
      {frame >= B1 && frame < B2 && (
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            padding: "8px 18px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.55)",
            color: "#F5F5F2",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "-0.01em",
            zIndex: 5,
          }}
        >
          Diabet — Type 1 Diabetes Toolkit
        </div>
      )}

      {cut(frame, B1, B2) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />
      )}
      {cut(frame, B1, B2) === 1 && (
        <MotionInsert
          effect="cornerTags"
          from={B1}
          dur={B2 - B1}
          accent={ACCENT}
          data={{
            statement: "Alert only lived on the clock page",
            tags: ["Red/blue flash", "Clock page only", "Hub still polling", "Invisible elsewhere"],
          }}
        />
      )}

      {cut(frame, B2, B3) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />
      )}
      {cut(frame, B2, B3) === 1 && (
        <MotionInsert
          effect="handoffExplain"
          from={B2}
          dur={B3 - B2}
          accent={ACCENT}
          data={{
            from: "Clock page open",
            to: "YouTube or any app",
            points: ["Warning vanishes", "Reading still falls", "No one gets notified"],
          }}
        />
      )}

      {/* b3: drawn only — the ledger itself fills the frame, red/unsettled. No backdrop, no hub/page. */}

      {cut(frame, B4, B5) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B4} hold={B5 - B4} />
      )}
      {cut(frame, B4, B5) === 1 && (
        <MotionInsert
          effect="pipelineFlow"
          from={B4}
          dur={B5 - B4}
          accent={ACCENT}
          data={{
            steps: ["Hub reading", "SirenService polls", "Full-screen overlay"],
            result: "Works without the clock page",
            system: "Android foreground service",
          }}
        />
      )}

      {cut(frame, B5, B6) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub" from={B5} hold={B6 - B5} />
      )}
      {cut(frame, B5, B6) === 1 && (
        <MotionInsert
          effect="copyCorrection"
          from={B5}
          dur={B6 - B5}
          accent={ACCENT}
          data={{
            wrong: "Alert stays behind the open app",
            right: "Full-screen flash over any app",
            label: "Now",
          }}
        />
      )}

      {/* b6: drawn only — ledger flips to green, settled, held to END. No fade, no page/hub. */}
      {frame >= B1 && frame < B2 && <Ledger expanded={false} settled={false} rowIndex={0} />}
      {frame >= B2 && frame < B3 && <Ledger expanded={false} settled={false} rowIndex={1} />}
      {frame >= B3 && frame < B4 && <Ledger expanded={true} settled={false} />}
      {frame >= B4 && frame < B5 && <Ledger expanded={false} settled={false} rowIndex={2} />}
      {frame >= B5 && frame < B6 && <Ledger expanded={false} settled={false} rowIndex={0} />}
      {frame >= B6 && <Ledger expanded={true} settled={true} />}
    </AbsoluteFill>
  );
};

export const FeatureLowSugarSirenFlashesD18: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
