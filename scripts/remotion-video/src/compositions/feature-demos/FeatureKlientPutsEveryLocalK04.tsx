// FeatureKlientPutsEveryLocalK04 — feature k04 — 1280x720, 935 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Before this feature, knowing which local business in Hamar, Lillehammer,
// Gjøvik, Ringsaker, Østre Toten or Vestre Toten had been contacted, had
// replied, or still needed a sample meant juggling spreadsheets with no
// sense of where anyone stood. Klient now pulls business records from
// Brønnøysundregistrene + OpenStreetMap, puts every one of them on a Leaflet
// map as a pin colored by outreach status, re-checks status in the
// background on a systemd timer, and queues + tracks outreach email
// automatically.
//
// Archetype 7 (hero-number): a single giant digit (fontSize 230, owning a
// 300px band across the full width, not a 112px corner badge beside a
// window) ticks upward across the clip toward the real fact stated in b5 —
// six towns, one map. Its caption line changes every beat, so it never sits
// unchanged for more than one beat.
//
// Persistent element through all five beats: a top-left "KLIENT — MAP"
// plate naming the product in beat 1, with a status line that changes every
// beat, locking to "✓ tracked" in b5.
//
// Beat → effect (plan: shots/k04.motion.json):
// b1  15-253   "Knowing who'd been contacted, who replied, and who still
//              needed a sample meant juggling spreadsheets with no sense of
//              where anyone stood." → cornerTags, the problem.
// b2 253-390   "Now every business gets a pin on a live map, built with
//              Leaflet." → handoffExplain, spreadsheet rows → one live map.
// b3 390-551   "Color tells the story at a glance, like traffic lights
//              instead of a spreadsheet row." → keywordCaption, the analogy.
// b4 551-734   "A background job checks status on its own, and outreach
//              emails queue and get tracked automatically." → pipelineFlow,
//              the 4-step automation.
// b5 734-935   "Six towns, one map, every pin tracked instead of lost in a
//              spreadsheet." → drawn LogWindow result (gate 2: never the
//              feature page or hub), hero number locks on 6.
//
// Single tech name in the whole clip: Leaflet (beat 2 only; script names in
// the b5 log are mechanism labels, not a second branded tech name).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, WIN_DEFAULT } from "./live-primitives";
import shotsFile from "./shots/k04.json";

const B1 = 15;
const B2 = 253;
const B3 = 390;
const B4 = 551;
const B5 = 734;
const END = 935;

/** Brighter than slate's own accent (#0E7490), which reads muddy on the dark plate. */
const ACCENT = "#36C9E8";
const STAGE = "#0A1620";

const BADGE = { x: 40, y: 40, w: 280, h: 64 };
const HERO_Y = 420;
const HERO_H = 300;

const HERO_CAPTIONS: { at: number; text: string }[] = [
  { at: B1, text: "no single source of truth" },
  { at: B2, text: "now: one live map" },
  { at: B3, text: "color = status, not a row" },
  { at: B4, text: "checked automatically" },
  { at: B5, text: "towns, one map, every pin tracked" },
];

/** Archetype 7: one giant digit ticking toward the real fact (6 towns), owning a full-width band. */
const HeroNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;
  const value = Math.round(interpolate(frame, [B1, END], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const caption = HERO_CAPTIONS.filter((c) => frame >= c.at).slice(-1)[0]?.text ?? "";
  return (
    <Arrive at={B1 + 4} kind="punch" box={{ x: 0, y: HERO_Y, w: 1280, h: HERO_H }} dur={0.5}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: HERO_Y,
          width: 1280,
          height: HERO_H,
          background: "rgba(10,22,32,0.86)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 230, fontWeight: 800, lineHeight: 1, color: ACCENT, textShadow: "8px 8px 0 rgba(0,0,0,0.55)" }}>
          {value}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1, color: P.card, marginTop: 6 }}>{caption}</div>
      </div>
    </Arrive>
  );
};

/** Persistent product plate — changes state every beat, locks to the win in b5. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;
  const done = frame >= B5;
  const status =
    frame >= B5 ? "✓ tracked" : frame >= B4 ? "auto recheck" : frame >= B3 ? "color = status" : frame >= B2 ? "live map" : "spreadsheets";
  return (
    <Arrive at={B1 + 4} kind="wipe" box={BADGE} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: BADGE.x,
          top: BADGE.y,
          width: BADGE.w,
          height: BADGE.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          padding: "9px 16px",
          boxSizing: "border-box",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: P.accent }}>KLIENT — MAP</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: done ? P.success : P.ink, marginTop: 4 }}>{status}</div>
      </div>
    </Arrive>
  );
};

const RESULT_FACTS: { label: string; value: string }[] = [
  { label: "towns on one map", value: "6" },
  { label: "outreach", value: "queued + tracked" },
];

const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  const win = WIN_DEFAULT;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 90, width: 1280, textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 3, color: ACCENT, fontFamily }}>RESULT</div>
      </div>
      <div style={{ position: "absolute", left: win.x, top: 122, width: win.w, display: "flex", gap: 24 }}>
        {RESULT_FACTS.map((f) => (
          <div
            key={f.label}
            style={{
              flex: 1,
              background: P.card,
              borderRadius: 4,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
              padding: "14px 18px",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.4, color: P.muted, textTransform: "uppercase" }}>
              {f.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: P.ink, marginTop: 4 }}>{f.value}</div>
          </div>
        ))}
      </div>
      <LogWindow
        title="server.mjs"
        from={B5 + 10}
        every={16}
        opacity={1}
        win={{ x: win.x, y: 198, w: win.w, h: 212 }}
        lines={[
          { t: "01", text: "fetch_brreg + osm_enrich + geocode → business records", tone: "ink" },
          { t: "02", text: "build_data.mjs → businesses.seed.json", tone: "muted" },
          { t: "03", text: "app.js: Leaflet map, 1 pin per business", tone: "ink" },
          { t: "04", text: "monitor.mjs (systemd timer): status rechecked in bg", tone: "success" },
          { t: "05", text: "server.mjs: outreach email queued + tracked", tone: "success" },
          { t: "06", text: "result: 6 towns, 1 map, every pin tracked", tone: "success" },
        ]}
      />
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: no single source of truth, juggling spreadsheets */}
      {cut(frame, B1, B2) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.03} focus={{ x: 0.5, y: 0.3 }} />
      )}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.72}
        data={{
          statement: "No single source of truth",
          tags: ["Who was contacted?", "Who replied?", "Who's left?", "All in spreadsheets"],
        }}
      />

      {/* b2 — the swap: spreadsheet rows → one live map */}
      {cut(frame, B2, B3) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} push={0.05} focus={{ x: 0.45, y: 0.3 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.72}
        data={{
          from: "Spreadsheet rows",
          to: "One live map",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Every business = a pin", "Built with Leaflet"],
        }}
      />

      {/* b3 — the analogy: color tells the story */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} push={0.07} focus={{ x: 0.4, y: 0.3 }} />
      )}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.72}
        data={{
          line1: "Pin color tells the story",
          line2: "like traffic lights, not a row",
          keywords: ["traffic lights"],
        }}
      />

      {/* b4 — the automation: background job + outreach queue */}
      {cut(frame, B4, B5) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B4} hold={B5 - B4} push={0.09} focus={{ x: 0.35, y: 0.25 }} />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.72}
        data={{
          steps: ["Monitor rechecks status", "Pin color updates", "Email queues", "Outreach tracked"],
          result: "Runs on its own",
          system: "background job",
        }}
      />

      {/* b5 — the result, drawn (never the feature page or the hub), holds to the end */}
      <Result />

      <HeroNumber />
      <ProductPlate />
    </AbsoluteFill>
  );
};

export const FeatureKlientPutsEveryLocalK04: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
