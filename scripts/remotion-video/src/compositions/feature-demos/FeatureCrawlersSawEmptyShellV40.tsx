/**
 * FeatureCrawlersSawEmptyShellV40 — feature v40 — 1280x720, 959 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 2 (zoom-in), mood mint. Beats 1-2 are drawn (no verified /news URL to
 * record tonight, and beat 2 is a metaphor), sliding past each other instead of a
 * plain crossfade. Beats 3-5 are RECORDINGS of the real fix and the real feature
 * page (tools/record-ui.cjs, shots/v40.json), with the camera zoom escalating
 * beat over beat to sell "zooming in" on the same window geometry:
 *
 *   fix1  github.com/…/commit/d5b0d6f2…  140 f   beat 3 (the SSR fix)
 *   fix2  github.com/…/commit/7fcb0689…  100 f   beat 4 (ISR + JSON-LD)
 *   page  vitalii.no/features/…-v40      160 f   beat 5
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–226  "A search engine opened my news page and saw an empty shell. No headline, no words — just a blank spinner."
 *  b2 235–414  "Every article loaded after the page already arrived — like handing a librarian a sealed box."
 *  b3 423–612  "So now Next.js bakes those articles straight into the page on the server, before it reaches a browser."
 *  b4 621–759  "The first twelve articles now render before the page ever leaves the server."
 *  b5 768–914  "No more empty shell — crawlers and readers now see the same twelve." — holds to 959.
 *
 * Single tech name in the whole clip: Next.js (beat 3 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, StatPill, FilterChip, CheckBadge, CaptionBand, fontFamily, seg } from "./bright-primitives";
import { LiveWindow, WIN_DEFAULT } from "./live-primitives";
import shots from "./shots/v40.json";

const P = MOODS.mint;
const WIN = WIN_DEFAULT;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** The hero number, top-left — the one element that survives every beat. */
const hero = (value: string, unit: string | undefined, label: string, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: 150,
      top: 34,
      width: 470,
      transform: `scale(${0.86 + 0.14 * Math.min(1, scale)})`,
      transformOrigin: "left top",
      fontFamily,
    }}
  >
    <div
      style={{
        fontSize: 112,
        lineHeight: 1,
        fontWeight: 800,
        letterSpacing: -4,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
      {unit ? <span style={{ fontSize: 112 * 0.34, marginLeft: 6 }}>{unit}</span> : null}
    </div>
    <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: P.muted }}>{label}</div>
  </div>
);

export const FeatureCrawlersSawEmptyShellV40: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 226, 242));
  const b2 = seg(frame, 235, 251) * (1 - seg(frame, 414, 430));
  const b3 = seg(frame, 423, 439) * (1 - seg(frame, 612, 628));
  const b4 = seg(frame, 621, 637) * (1 - seg(frame, 759, 775));
  const b5 = seg(frame, 768, 784); // holds through 959

  const heroPop1 = pop(15);
  const heroPop2 = pop(235);
  const heroPop3 = pop(423);
  const heroPop4 = pop(621);
  const heroPop5 = pop(768);

  // beat 1 → beat 2: a directional slide instead of a plain crossfade.
  const slideOut1 = interpolate(frame, [210, 242], [0, -160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const slideIn2 = interpolate(frame, [235, 267], [160, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // beat 1: the spinner keeps turning while the page stays blank
  const spin = (frame - 15) * 8;

  const chipPop = pop(500);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : a crawler finds an empty shell (drawn) ---------------- */}
        <Group opacity={b1} dy={0}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${slideOut1}px)` }}>
            {hero("0", undefined, "ARTICLES IN THE RAW HTML", P.danger, heroPop1)}
            <StatPill x={690} y={52} emoji="🤖" text="a search engine opens the page" tone="danger" opacity={b1} />
            <StatPill x={690} y={112} emoji="👀" text="finds nothing to read" tone="danger" opacity={b1} />
            <div
              style={{
                position: "absolute",
                left: 470,
                top: 220,
                width: 340,
                height: 230,
                borderRadius: 16,
                background: P.card,
                border: `1.5px solid ${P.border}`,
                boxShadow: "0 20px 44px rgba(16,40,29,0.16)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "0 12px",
                  borderBottom: `1px solid ${P.border}`,
                  fontSize: 12,
                  fontWeight: 700,
                  color: P.muted,
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: 99, background: "#F0C3BB" }} />
                <span style={{ width: 9, height: 9, borderRadius: 99, background: "#DFC96F" }} />
                <span style={{ width: 9, height: 9, borderRadius: 99, background: "#B8E3C1" }} />
                <span style={{ marginLeft: 6 }}>vitalii.no/news</span>
              </div>
              <div style={{ position: "relative", width: "100%", height: 230 - 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    border: `6px solid ${P.accentEdge}`,
                    borderTopColor: P.accent,
                    transform: `rotate(${spin}deg)`,
                  }}
                />
              </div>
            </div>
            <CaptionBand y={664} fontSize={22} text="No headline, no words — just a blank spinner" tone="danger" opacity={b1} />
          </div>
        </Group>

        {/* ---------------- beat 2 : sealed box for the librarian (metaphor, stays drawn) ---------------- */}
        <Group opacity={b2}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${slideIn2}px)` }}>
            {hero("Later", undefined, "WHEN THE ARTICLES ARRIVE", P.danger, heroPop2)}
            <StatPill x={690} y={52} emoji="📦" text="content sealed until JS runs" tone="danger" opacity={b2} />
            <StatPill x={690} y={112} emoji="⏳" text="arrives after the page loaded" tone="danger" opacity={b2} />
            <div
              style={{
                position: "absolute",
                left: 380,
                top: 200,
                width: 520,
                height: 310,
                borderRadius: 18,
                background: P.card,
                border: `1.5px solid ${P.border}`,
                boxShadow: "0 24px 50px rgba(16,40,29,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 40,
              }}
            >
              <div style={{ fontSize: 96 }}>📦</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 64 }}>📚</div>
                <div style={{ marginTop: 8, fontSize: 15, fontWeight: 700, color: P.muted, letterSpacing: 1 }}>
                  a sealed box on the desk
                </div>
              </div>
            </div>
            <CaptionBand y={664} fontSize={22} text="Like handing a librarian a sealed box" tone="danger" opacity={b2} />
          </div>
        </Group>

        {/* ---------------- beat 3 : the real SSR fix, zooming in ---------------- */}
        <Group opacity={b3}>
          {hero("Server", undefined, "BAKES THE ARTICLES IN NOW", P.accent, heroPop3)}
          <StatPill x={690} y={52} emoji="🛠" text="renders on the server now" tone="accent" opacity={b3} />
          <StatPill x={690} y={112} emoji="📄" text="raw HTML, no wait for JS" tone="accent" opacity={b3} />
          <FilterChip x={WIN.x + WIN.w - 210} y={WIN.y - 34} text="Next.js" icon="🛠" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <CaptionBand y={664} fontSize={22} text="Next.js now bakes the articles into the page on the server" tone="accent" opacity={b3} />
        </Group>
        <LiveWindow
          file={shots}
          shot="fix1"
          title="github.com — the page.tsx commit"
          from={423}
          hold={189}
          zoom={(t) => 1 + 0.1 * easeInOut(t)}
          focus={{ x: 0.4, y: 0.35 }}
          opacity={b3}
        />

        {/* ---------------- beat 4 : the real ISR + JSON-LD fix, zoomed further ---------------- */}
        <Group opacity={b4}>
          {hero("12", undefined, "ARTICLES RENDER BEFORE THE PAGE LEAVES THE SERVER", P.accent, heroPop4)}
          <StatPill x={690} y={52} emoji="📄" text="first 12 articles, server-rendered" tone="accent" opacity={b4} />
          <StatPill x={690} y={112} emoji="⚡" text="10-minute refresh, no refetch" tone="accent" opacity={b4} />
          <CaptionBand y={664} fontSize={22} text="The first twelve articles now render before the page ever leaves the server" tone="accent" opacity={b4} />
        </Group>
        <LiveWindow
          file={shots}
          shot="fix2"
          title="github.com — the ISR + JSON-LD commit"
          from={621}
          hold={138}
          zoom={(t) => 1.12 + 0.1 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b4}
        />

        {/* ---------------- beat 5 : the shipped feature page, closest zoom, holds to the tail ---------------- */}
        <Group opacity={b5}>
          {hero("12", undefined, "ARTICLES, VISIBLE FROM THE FIRST BYTE", P.success, heroPop5)}
          <StatPill x={690} y={52} emoji="✅" text="crawlers see what readers see" tone="success" opacity={b5} />
          <StatPill x={690} y={112} emoji="🌐" text="indexable from byte one" tone="success" opacity={b5} />
          <CheckBadge x={1080} y={44} size={44} opacity={b5} scale={heroPop5} />
          <CaptionBand y={664} fontSize={22} text="No more empty shell — crawlers and readers now see the same twelve" tone="success" opacity={b5} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features — the fix, shipped"
          from={768}
          hold={191}
          zoom={(t) => 1.25 + 0.12 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.45 }}
          opacity={b5}
        />
      </div>
    </PaletteProvider>
  );
};
