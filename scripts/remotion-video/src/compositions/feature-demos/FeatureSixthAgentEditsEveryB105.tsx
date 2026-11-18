// FeatureSixthAgentEditsEveryB105 — feature b105 — 1280x720, 922 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood mint.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { LiveBackdrop, MotionInsert, cut } from "./motion-primitives";
import shotsFile from "./shots/b105.json";

const B1 = 15;
const B2 = 167;
const B3 = 298;
const B4 = 435;
const B5 = 572;
const B6 = 736;
const END = 922;

const ACCENT = "#3FA796";

// Persistent archetype-0 split-duel strip: left = flaw caught, right = fix applied.
// Each beat reveals one new line on one side only — nothing already shown repeats or freezes beyond its beat.
const DuelPanel: React.FC<{ step: number; hero: boolean }> = ({ step, hero }) => {
  const p = usePalette();

  const flaws = ["Quizzed mid-video", "Vague numbers", "Explanation buried"];
  const fixes = ["Blocks quiz questions", "Demands real numbers", "Protects the explanation"];

  const leftCount = Math.min(3, Math.max(0, step));
  const rightCount = Math.min(3, Math.max(0, step - 3));

  if (hero) {
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            flex: 1,
            background: p.dangerBg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 22, fontWeight: 700, color: p.danger }}>
            Before
          </div>
          {flaws.map((f) => (
            <div
              key={f}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 20,
                fontWeight: 600,
                color: p.muted,
                textDecoration: "line-through",
              }}
            >
              {f}
            </div>
          ))}
        </div>
        <div
          style={{
            flex: 1,
            background: p.accentBg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 22, fontWeight: 700, color: p.accent }}>
            After — 6th editor
          </div>
          {fixes.map((f) => (
            <div
              key={f}
              style={{ fontFamily: "Inter, sans-serif", fontSize: 20, fontWeight: 700, color: p.ink }}
            >
              {f}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 606,
        width: 1200,
        height: 92,
        borderRadius: 16,
        background: p.card,
        border: `2px solid ${p.border}`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
        display: "flex",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 22px",
          borderRight: `1px solid ${p.border}`,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: p.danger, opacity: 0.8 }}>BEFORE</div>
        {flaws.slice(0, leftCount).map((f) => (
          <div
            key={f}
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: p.danger,
              background: p.dangerBg,
              borderRadius: 8,
              padding: "6px 12px",
            }}
          >
            {f}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 22px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: p.accent, opacity: 0.8 }}>AFTER</div>
        {fixes.slice(0, rightCount).map((f) => (
          <div
            key={f}
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: p.accent,
              background: p.accentBg,
              borderRadius: 8,
              padding: "6px 12px",
            }}
          >
            {f}
          </div>
        ))}
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const hero = frame >= B6;

  let step = 0;
  if (frame >= B4) step = 4;
  if (frame >= B5) step = 6;
  else if (frame >= B3) step = 3;
  else if (frame >= B2) step = 2;
  else if (frame >= B1) step = 1;

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
          Boytasks — screen-time &amp; task system for the kids
        </div>
      )}

      {cut(frame, B1, B2) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />
      )}
      {cut(frame, B1, B2) === 1 && (
        <MotionInsert
          effect="regionCallout"
          from={B1}
          dur={B2 - B1}
          accent={ACCENT}
          data={{
            region: { x: 12, y: 18, w: 50, h: 22 },
            label: "First render",
            note: "The first full render exposed problems no one had caught",
          }}
        />
      )}

      {cut(frame, B2, B3) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />
      )}
      {cut(frame, B2, B3) === 1 && (
        <MotionInsert
          effect="cornerTags"
          from={B2}
          dur={B3 - B2}
          accent={ACCENT}
          data={{
            statement: "Quizzed the kid mid-video",
            tags: ["Predict", "Check", "Recall", "Reveal answer"],
          }}
        />
      )}

      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} />
      )}
      {cut(frame, B3, B4) === 1 && (
        <MotionInsert
          effect="keywordCaption"
          from={B3}
          dur={B4 - B3}
          accent={ACCENT}
          data={{
            line1: "Numbers stayed vague",
            line2: "the real explanation got buried under filler",
            keywords: ["vague", "buried"],
          }}
        />
      )}

      {cut(frame, B4, B5) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />
      )}
      {cut(frame, B4, B5) === 1 && (
        <MotionInsert
          effect="pipelineFlow"
          from={B4}
          dur={B5 - B4}
          accent={ACCENT}
          data={{
            steps: ["Quiz question — blocked", "Vague number — flagged", "Core share — checked"],
            result: "Sixth editor pass",
            system: "Script editor",
          }}
        />
      )}
      {/* single small tech caption for the whole clip */}
      {cut(frame, B4, B5) === 1 && (
        <div
          style={{
            position: "absolute",
            left: 40,
            bottom: 112,
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            color: "rgba(245,245,242,0.75)",
          }}
        >
          Literary editor — a sixth AI pass that rewrites for meaning, not just grammar
        </div>
      )}

      {cut(frame, B5, B6) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B5} hold={B6 - B5} />
      )}
      {cut(frame, B5, B6) === 1 && (
        <MotionInsert
          effect="featureMatrix"
          from={B5}
          dur={B6 - B5}
          accent={ACCENT}
          data={{
            options: ["Before", "After (6th editor)"],
            rows: [
              { label: "Quiz mid-video", values: ["Allowed", "Blocked"] },
              { label: "Numbers", values: ["Vague", "Real, sourced"] },
              { label: "Core explanation", values: ["Buried", "Protected"] },
            ],
          }}
        />
      )}

      {/* persistent split-duel archetype element, every beat */}
      {frame >= B1 && frame < B6 && <DuelPanel step={step} hero={false} />}
      {/* b6: drawn only — split-duel expands full-screen with the real 30% number, held to END. No fade, no page/hub. */}
      {hero && <DuelPanel step={6} hero={true} />}
      {hero && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              background: usePalette().card,
              border: `2px solid ${usePalette().accentEdge}`,
              borderRadius: 24,
              padding: "28px 46px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 120,
                fontWeight: 900,
                color: usePalette().accent,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              30%
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: usePalette().ink,
              }}
            >
              minimum runtime for the core explanation, every video
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const FeatureSixthAgentEditsEveryB105: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
