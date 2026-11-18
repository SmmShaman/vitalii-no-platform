// FeatureSpareAndroidTvStickD17 — feature d17 — 1280x720, 955 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood violet.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { LiveBackdrop, MotionInsert, cut } from "./motion-primitives";
import shotsFile from "./shots/d17.json";

const B1 = 15;
const B2 = 185;
const B3 = 337;
const B4 = 473;
const B5 = 622;
const B6 = 768;
const END = 955;

const ACCENT = "#6D4FC9";

// Persistent archetype-4 flow-map strip: 3 nodes, stick -> launcher -> cost.
// Before B4 the launcher/cost nodes read the paid-licence problem (muted);
// from B4 they flip to the fix (accent). At B6 the cost node becomes the hero.
const FlowMap: React.FC<{ fixed: boolean; hero: boolean }> = ({ fixed, hero }) => {
  const p = usePalette();
  const tone = fixed ? p.accent : p.danger;
  const toneBg = fixed ? p.accentBg : p.dangerBg;
  const toneEdge = fixed ? p.accentEdge : p.dangerEdge;

  const nodes = [
    { label: "Spare TV stick", value: "Spare TV stick" },
    { label: "Launcher", value: fixed ? "WebView HOME app" : "Paid licence" },
    { label: "Result", value: fixed ? "Boots into our clock" : "Reverts to Android home" },
  ];

  if (hero) {
    const chips = ["Spare TV stick", "WebView HOME app", "Glucose + time + weather"];
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 70px",
          gap: 28,
        }}
      >
        <div
          style={{
            flex: 1,
            height: "100%",
            borderRadius: 24,
            background: p.card,
            border: `2px solid ${p.border}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: p.muted }}>Hardware</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: p.ink, textAlign: "center", padding: "0 16px" }}>
            Spare TV stick
          </div>
        </div>
        <div style={{ fontSize: 48, color: p.muted, fontWeight: 700 }}>&rarr;</div>
        <div
          style={{
            flex: 1,
            height: "100%",
            borderRadius: 24,
            background: p.accentBg,
            border: `2px solid ${p.accentEdge}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: p.accent }}>Launcher</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: p.ink, textAlign: "center", padding: "0 16px" }}>
            WebView HOME app
          </div>
        </div>
        <div style={{ fontSize: 48, color: p.muted, fontWeight: 700 }}>&rarr;</div>
        <div
          style={{
            flex: 1.3,
            height: "100%",
            borderRadius: 24,
            background: p.card,
            border: `3px solid ${p.accentEdge}`,
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: p.accent }}>Result</div>
          <div
            style={{
              fontSize: 140,
              fontWeight: 900,
              color: p.accent,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            $0
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: p.ink, textAlign: "center", padding: "0 20px" }}>
            No licence, no fallback screen
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {chips.map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: p.muted,
                  background: p.bgTop,
                  border: `1px solid ${p.border}`,
                  borderRadius: 8,
                  padding: "6px 14px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
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
        border: `2px solid ${toneEdge}`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 18,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {nodes.map((n, i) => (
        <React.Fragment key={n.label}>
          <div
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: i === 0 ? p.ink : tone,
              background: i === 0 ? "transparent" : toneBg,
              borderRadius: 8,
              padding: i === 0 ? 0 : "6px 14px",
            }}
          >
            {n.value}
          </div>
          {i < nodes.length - 1 && (
            <div style={{ fontSize: 22, color: p.muted, fontWeight: 700 }}>&rarr;</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const fixed = frame >= B4;
  const hero = frame >= B6;

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
          effect="keywordCaption"
          from={B1}
          dur={B2 - B1}
          accent={ACCENT}
          data={{
            line1: "A paid licence",
            line2: "just to lock one page on screen",
            keywords: ["licence", "one page"],
          }}
        />
      )}

      {cut(frame, B2, B3) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />
      )}
      {cut(frame, B2, B3) === 1 && (
        <MotionInsert
          effect="statusFocus"
          from={B2}
          dur={B3 - B2}
          accent={ACCENT}
          data={{
            title: "Without it",
            claims: [
              { text: "No licence installed", verdict: "yes" },
              { text: "Stays on the clock page", verdict: "no" },
            ],
          }}
        />
      )}

      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} />
      )}
      {cut(frame, B3, B4) === 1 && (
        <MotionInsert
          effect="funnelAbsorption"
          from={B3}
          dur={B4 - B3}
          accent={ACCENT}
          data={{
            inputs: ["No licence", "Reverts to Android home", "Idle battery animation"],
            result: "A screen nobody asked for",
          }}
        />
      )}

      {cut(frame, B4, B5) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />
      )}
      {cut(frame, B4, B5) === 1 && (
        <MotionInsert
          effect="copyCorrection"
          from={B4}
          dur={B5 - B4}
          accent={ACCENT}
          data={{
            wrong: "Stick reverts to Android home",
            right: "Tiny app IS the home screen now",
            label: "Now",
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
          WebView HOME app — a browser window acting as the launcher
        </div>
      )}

      {cut(frame, B5, B6) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B5} hold={B6 - B5} />
      )}
      {cut(frame, B5, B6) === 1 && (
        <MotionInsert
          effect="cornerTags"
          from={B5}
          dur={B6 - B5}
          accent={ACCENT}
          data={{
            statement: "The clock keeps running",
            tags: ["Glucose shown live", "Stale, struck through", "Local time, always on", "Zero licence cost"],
          }}
        />
      )}

      {/* persistent flow-map archetype element, every beat */}
      {frame >= B1 && frame < B6 && <FlowMap fixed={fixed} hero={false} />}
      {/* b6: drawn only — flow collapses to the $0 hero result, held to END. No fade, no page/hub. */}
      {hero && <FlowMap fixed={true} hero={true} />}
    </AbsoluteFill>
  );
};

export const FeatureSpareAndroidTvStickD17: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
